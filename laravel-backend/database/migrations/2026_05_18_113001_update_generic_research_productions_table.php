<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('generic_research_productions', function (Blueprint $table) {
            $table->dropColumn(['title', 'date', 'organization']);
            $table->json('dynamic_data')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('generic_research_productions', function (Blueprint $table) {
            $table->string('title')->nullable();
            $table->date('date')->nullable();
            $table->string('organization')->nullable();
            $table->dropColumn('dynamic_data');
        });
    }
};
