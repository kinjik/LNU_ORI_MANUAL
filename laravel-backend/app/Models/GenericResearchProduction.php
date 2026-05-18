<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GenericResearchProduction extends Model
{
    use HasFactory;

    protected $fillable = [
        'dynamic_data',
        'collaborators',
        'researchmonitoringform_id',
    ];

    protected $casts = [
        'dynamic_data' => 'array',
    ];

    public function researchmonitoringform(): BelongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class);
    }
}
