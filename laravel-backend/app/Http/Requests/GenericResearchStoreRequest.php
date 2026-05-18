<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenericResearchStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'research_involvement_type' => ['required', 'integer', 'exists:research_involvement_types,id'],
            'research_documents'        => ['required', 'array'],
            'research_documents.*'      => ['string'],
            'sdg_mappings'              => ['required', 'array'],
            'sdg_mappings.*'            => ['integer'],
            'agenda_mappings'           => ['required', 'array'],
            'agenda_mappings.*'         => ['integer'],

            'generic.author_ids'   => ['required', 'array'],
            'generic.author_ids.*' => ['integer', 'exists:users,id'],
            'generic.points'       => ['required', 'numeric'],
            'generic.dynamic_data' => ['nullable', 'array'],
        ];
    }
}
