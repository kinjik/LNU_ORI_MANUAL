<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Insert default values
        DB::table('system_settings')->insert([
            [
                'key' => 'signatory_executive_director',
                'value' => 'Enter Executive Director Name',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'signatory_vice_president',
                'value' => 'Enter Vice President Name',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
