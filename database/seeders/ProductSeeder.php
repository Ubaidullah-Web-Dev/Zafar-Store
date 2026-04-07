<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Read the static JSON data
        $json = File::get(resource_path('js/data/data.json'));
        $products = json_decode($json, true);

        foreach ($products as $item) {
            Product::create([
                'name' => $item['name'],
                'department' => $item['department'],
                'category' => $item['category'],
                'price' => $item['price'],
            ]);
        }
    }
}
