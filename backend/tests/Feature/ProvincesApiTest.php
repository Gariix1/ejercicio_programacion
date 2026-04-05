<?php

namespace Tests\Feature;

use Tests\TestCase;

class ProvincesApiTest extends TestCase
{
    public function test_it_lists_seeded_provinces(): void
    {
        $this->getJson('/api/provinces')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.type', 'provinces')
            ->assertJsonPath('data.0.attributes.nombre', 'Azuay')
            ->assertJsonPath('meta.module', 'provinces');
    }
}
