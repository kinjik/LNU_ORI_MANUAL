<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('research_monitoring_form_coauthors', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('researchmonitoringform_id');
            
            $table->foreign('researchmonitoringform_id', 'rmf_form_id_fk')
                  ->references('id')
                  ->on('research_monitoring_forms')
                  ->onDelete('cascade');

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
                  
            $table->timestamps();

            $table->unique(['researchmonitoringform_id', 'user_id'], 'rmf_user_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('research_monitoring_form_coauthors');
    }
};