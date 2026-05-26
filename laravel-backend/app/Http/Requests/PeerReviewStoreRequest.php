<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PeerReviewStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'research_involvement_type' => ['required', 'integer'],
            'research_documents' => ['required', 'array'],
            'research_documents.*' => ['string'],
            'sdg_mappings' => ['required', 'array'],
            'sdg_mappings.*' => ['integer'], 
            'agenda_mappings' => ['required', 'array'],
            'agenda_mappings.*' => ['integer'],

            'peerjournal.name' => ['string','required'],
            'peerjournal.article_title' => ['string'],
            'peerjournal.article_reviewed' => ['string'],
            'peerjournal.abstract_title' => ['string'],
            'peerjournal.abstract_reviewed' => ['string'],
            'peerjournal.coverage' => ['string','required'],
            'peerjournal.date_reviewed' => ['date','required'],
            'peerjournal.organization' => ['string','required'],
            'peerjournal.author_ids' => ['required', 'array'],
            'peerjournal.author_ids.*' => [
                function ($attribute, $value, $fail) {
                    if (is_numeric($value)) {
                        if (!\Illuminate\Support\Facades\DB::table('users')->where('id', $value)->exists()) {
                            $fail('The selected author is invalid.');
                        }
                    } elseif (!is_string($value)) {
                        $fail('The author must be a valid user ID or a string name.');
                    } elseif (strlen($value) > 255) {
                        $fail('The custom author name must not exceed 255 characters.');
                    }
                }
            ],
            'peerjournal.points' => ['integer','required'],
        ];
    }
}

