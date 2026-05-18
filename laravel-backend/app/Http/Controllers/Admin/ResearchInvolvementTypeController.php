<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResearchInvolvementType;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;

class ResearchInvolvementTypeController extends Controller
{
    use HttpResponses;

    public function index()
    {
        $types = ResearchInvolvementType::all();
        return $this->success($types, 'Research Involvement Types retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'research_involvement_type' => 'required|string|max:255',
            'enable' => 'boolean',
            'default_points' => 'nullable|numeric|min:0',
            'form_schema' => 'nullable|array',
        ]);

        $validated['is_custom'] = true;
        if (!isset($validated['enable'])) {
            $validated['enable'] = true;
        }

        $type = ResearchInvolvementType::create($validated);

        return $this->success($type, 'Custom Research Involvement Type created successfully', 201);
    }

    public function update(Request $request, ResearchInvolvementType $researchInvolvementType)
    {
        $validated = $request->validate([
            'research_involvement_type' => 'required|string|max:255',
            'enable' => 'boolean',
            'default_points' => 'nullable|numeric|min:0',
            'form_schema' => 'nullable|array',
        ]);

        $researchInvolvementType->update($validated);

        return $this->success($researchInvolvementType, 'Research Involvement Type updated successfully');
    }

    public function destroy(ResearchInvolvementType $researchInvolvementType)
    {
        if (!$researchInvolvementType->is_custom) {
            return $this->error(null, 'Cannot delete a built-in research involvement type', 403);
        }

        $researchInvolvementType->delete();

        return $this->success(null, 'Research Involvement Type deleted successfully');
    }
}
