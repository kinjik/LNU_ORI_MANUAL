<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SystemSettingController extends Controller
{
    public function index()
    {
        $settings = SystemSetting::all()->pluck('value', 'key');

        // Convert stored path to a full public URL for the frontend
        if (!empty($settings['report_header_image'])) {
            $settings['report_header_image'] = Storage::disk('public')->url($settings['report_header_image']);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'settings'   => 'required|array',
            'settings.*' => 'nullable|string',
        ]);

        foreach ($data['settings'] as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key'   => $key],
                ['value' => $value]
            );
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Settings updated successfully',
        ]);
    }

    /**
     * Handle the header image upload separately (multipart/form-data).
     */
    public function uploadHeaderImage(Request $request)
    {
        $request->validate([
            'report_header_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
        ]);

        // Delete the old file if one already exists
        $existing = SystemSetting::where('key', 'report_header_image')->first();
        if ($existing && $existing->value) {
            Storage::disk('public')->delete($existing->value);
        }

        // Store the new image under storage/app/public/reports/
        $path = $request->file('report_header_image')->store('reports', 'public');

        SystemSetting::updateOrCreate(
            ['key'   => 'report_header_image'],
            ['value' => $path]           // store the relative path, not the URL
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'Header image uploaded successfully',
            'url'     => Storage::disk('public')->url($path),
        ]);
    }

    /**
     * Delete the custom header image and revert to the default static asset.
     */
    public function deleteHeaderImage()
    {
        $existing = SystemSetting::where('key', 'report_header_image')->first();

        if ($existing && $existing->value) {
            Storage::disk('public')->delete($existing->value);
            $existing->update(['value' => null]);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Header image reverted to default',
        ]);
    }
}

