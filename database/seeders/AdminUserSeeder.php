<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed the hardcoded admin user.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@zafarstore.shop'],
            [
                'name' => 'Zafar Admin',
                'password' => Hash::make('zafarstore@admin'),
            ]
        );
    }
}
