<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generic_research_productions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->date('date');
            $table->string('organization')->nullable();
            $table->string('collaborators')->nullable(); // Legacy fallback string
            $table->unsignedBigInteger('researchmonitoringform_id');
            $table->foreign('researchmonitoringform_id')
                  ->references('id')
                  ->on('research_monitoring_forms')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generic_research_productions');
    }
};
