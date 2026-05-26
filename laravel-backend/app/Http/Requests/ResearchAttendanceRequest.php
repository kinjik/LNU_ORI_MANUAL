<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResearchAttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
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
            
            'participation.date' => ['required'],
            'participation.organizer' => ['string', 'required'],
            'participation.research_title' => ['string', 'required'],
            'participation.coverage' => ['string', 'required'],
            'participation.place' => ['string', 'required'],
            'participation.attendance_nature' => ['string', 'required'],
            'participation.fund_source_nature' => ['string', 'required'],
            'participation.conference_type' => ['string', 'required'],
            'participation.author_ids' => ['required', 'array'],
            'participation.author_ids.*' => [
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
            'participation.points' => ['required', 'numeric'],
        ];
    }
}

