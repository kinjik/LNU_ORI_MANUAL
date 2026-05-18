<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('research_involvement_types', function (Blueprint $table) {
            $table->decimal('default_points', 8, 2)->nullable();
            $table->json('form_schema')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('research_involvement_types', function (Blueprint $table) {
            $table->dropColumn(['default_points', 'form_schema']);
        });
    }
};
