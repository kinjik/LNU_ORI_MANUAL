<?php

namespace App\Http\Controllers;

use App\Enums\ResearchMonitoringFormStatus;
use App\Enums\RoleEnum;
use App\Http\Requests\GenericResearchStoreRequest;
use App\Models\AcademicYear;
use App\Models\GenericResearchProduction;
use App\Models\Point;
use App\Models\ResearchDocument;
use App\Models\ResearchMonitoringForm;
use App\Models\User;
use App\Notifications\ResearchMonitoringFormNotification;
use App\Traits\HttpResponses;
use App\Traits\PointsRating;
use App\Traits\useFileHandler;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class GenericResearchController extends Controller
{
    use HttpResponses, PointsRating, useFileHandler;

    public function store(GenericResearchStoreRequest $request)
    {
        $allowed = AcademicYear::first();
        if (!$allowed->is_submission_enable) {
            return $this->error(null, 'Submission is currently disabled.', 404);
        }

        try {
            DB::beginTransaction();

            $validated = $request->safe()->all();
            $user      = auth()->user();
            $name      = $user->getFullName();
            $points    = $validated['generic']['points'];

            $coordinators = User::role(RoleEnum::RESEARCH_COORDINATOR)
                ->where('college', $user->college)
                ->get()
                ->filter(fn ($u) => $u->hasExactRoles(RoleEnum::RESEARCH_COORDINATOR));

            $researchForm = ResearchMonitoringForm::create([
                'users_id'                     => Auth::id(),
                'research_involvement_type_id' => $validated['research_involvement_type'],
                'status'                       => ResearchMonitoringFormStatus::PENDING,
                'reviewed_by'                  => null,
                'reviewed_at'                  => null,
            ]);

            $researchForm->agendaMappings()->attach($validated['agenda_mappings']);
            $researchForm->sdgMappings()->attach($validated['sdg_mappings']);

            // Upload documents
            $docs = [];
            foreach ($validated['research_documents'] as $file) {
                $filePath = $this->movetToDocuments($file);
                $docs[] = [
                    'file_path'                  => $filePath,
                    'researchmonitoringform_id'  => $researchForm->id,
                    'status'                     => ResearchMonitoringFormStatus::PENDING,
                    'created_at'                 => now(),
                    'updated_at'                 => now(),
                ];
            }
            ResearchDocument::insert($docs);

            // Build collaborators fallback string
            $authorIds    = $validated['generic']['author_ids'] ?? [];
            if (!in_array(Auth::id(), $authorIds)) {
                $authorIds[] = Auth::id();
            }
            $collaboratorsStr = count($authorIds) > 1 ? 'Multiple Collaborators (See Database)' : $user->getFullName();

            GenericResearchProduction::create([
                'dynamic_data'              => $validated['generic']['dynamic_data'] ?? null,
                'collaborators'             => $collaboratorsStr,
                'researchmonitoringform_id' => $researchForm->id,
            ]);

            $researchForm->coauthors()->sync($authorIds);

            $rating = $this->rating($points);
            Point::create([
                'points'                    => $points,
                'rating'                    => $rating,
                'researchmonitoringform_id' => $researchForm->id,
            ]);

            Notification::send(
                $coordinators,
                new ResearchMonitoringFormNotification(
                    $name . ' submitted a research monitoring form.',
                    '/research-monitoring-form/' . $researchForm->id,
                    $user->image_path ?? '',
                    $name
                )
            );

            DB::commit();

            return $this->success($researchForm->id, 'Generic research form submitted successfully!', 201);
        } catch (Exception $e) {
            DB::rollBack();
            return $this->error(null, 'Error creating generic research record: ' . $e->getMessage(), 403);
        }
    }
}
