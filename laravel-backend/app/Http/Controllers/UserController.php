<?php

namespace App\Http\Controllers;

use App\Enums\ResearchMonitoringFormStatus;
use Illuminate\Http\Request;
use App\Http\Requests\AddFacultyRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use App\Traits\HttpResponses;
use App\Traits\useFileHandler;
use App\Enums\RoleEnum;
use App\Models\User;
use App\Notifications\UserCreatedNotification;
use App\Traits\PointsRating;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    use HttpResponses;
    use useFileHandler;
    use PointsRating;

    public function index()
    {
        $faculty = User::query()
        ->role(RoleEnum::FACULTY)
        ->select(['id','academic_rank', 'unit', 'college', 'fname', 'lname', 'email', 'mi', 'suffix'])
        ->withCount([
            'researchmonitoringform as totalPoints' => function ($query) {

                $query->where('status', ResearchMonitoringFormStatus::APPROVED)
                      ->orWhere('status', ResearchMonitoringFormStatus::EVALUATED)
                      ->select(DB::raw('sum(points.points)'))
                      ->join('points', 'research_monitoring_forms.id', '=', 'points.researchmonitoringform_id');
            }
        ])
        ->latest()
        ->get();

       $totalCME = User::query()->role(RoleEnum::FACULTY)->where('college', 'CME')->count();
       $totalCOE = User::query()->role(RoleEnum::FACULTY)->where('college', 'COE')->count();
       $totalCAS = User::query()->role(RoleEnum::FACULTY)->where('college', 'CAS')->count();

       $faculty = $faculty->map(function ($user) {
        $user->name = $user->getFullName();
        $user->rating = $this->rating($user->totalPoints ?? 0);
        $user->coordinator = $user->hasRole(RoleEnum::RESEARCH_COORDINATOR);
        $user->is_admin = $user->hasRole(RoleEnum::ADMIN);
        return $user;
    });

        return $this->success([
            'total_cas' => $totalCAS,
            'total_cme' => $totalCME,
            'total_coe' => $totalCOE,
            'users' => $faculty
        ], 'Faculty Retrieved Succesfully');
    }

    public function show(User $user)
    {
        return $this->success($user, 'Faculty Retrieved Succesfully');
    }

    public function update(User $user, UpdateUserRequest $request)
    {

        $updatedImage = $user->getRawOriginal('image_path');

        if ($request->has('image_path') && !empty($request->image_path)) {
            $storageBaseUrl = Storage::disk('public')->url('');
            $filePath = Str::after($request->image_path, $storageBaseUrl);

            if ($filePath && Storage::disk('public')->exists($filePath)) {
                if (!Str::contains($request->image_path, $user->getRawOriginal('image_path'))) {
                    $updatedImage = $this->moveToStorage($request->image_path);
                    $oldImagePath = $user->getRawOriginal('image_path');
                    if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                        Storage::disk('public')->delete($oldImagePath);
                    }
                }
            }
        }

        $user->update([
            'fname' => $request->fname,
            'lname' => $request->lname,
            'mi' => $request->mi,
            'suffix' => $request->suffix,
            'image_path' => $updatedImage, // Now correctly saves either the NEW or the OLD image
            'academic_rank' => $request->academic_rank,
            'college' => $request->college,
            'unit' => $request->unit,
            'email' => $request->email
        ]);

        return $this->success($user, 'Faculty Updated Successfully');
    }

    public function assignRole(User $user, Request $request)
    {
        $request->validate([
            'role' => 'required|string|in:research-coordinator,admin',
        ]);

        $user->assignRole($request->role);
        $user->load('roles:id,name');

        return $this->success($user, ucfirst($request->role) . ' role assigned successfully');
    }

    public function revokeRole(User $user, Request $request)
    {
        $request->validate([
            'role' => 'required|string|in:research-coordinator,admin',
        ]);

        $user->removeRole($request->role);
        $user->load('roles:id,name');

        return $this->success($user, ucfirst($request->role) . ' role removed successfully');
    }

    public function store(AddFacultyRequest $req)
    {
        $imagePath = '';
        if($req->image_path){
            $imagePath = $this->moveToStorage($req->image_path);
        }

        $req->validated();

        $user = User::create([
            'fname' => $req->fname,
            'lname' => $req->lname,
            'mi' => $req->mi,
            'suffix' => $req->suffix,
            'image_path' => $req->image_path ? $imagePath : null,
            'college' => $req->college,
            'unit' => $req->unit,
            'academic_rank' => $req->academic_rank,
            'email' => $req->email,
            'password' => Hash::make($req->password)
        ])->assignRole(RoleEnum::FACULTY);

        $admin = auth()->user();

        return $this->success($user, 'Faculty Added Succesfully');
    }

    public function destroy(User $user)
    {
        if ($user->image_path) {
            Storage::disk('public')->delete($user->image_path);
        }

        $user->forceDelete();
        return $this->success('','Faculty deleted successfully');
    }
}