<?php
// Set headers for CORS and JSON content type
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Path to the JSON file
$jsonFilePath = $_SERVER['DOCUMENT_ROOT'] . '/library/data/monster/monster_data.json';

// Check if the file exists
if (!file_exists($jsonFilePath)) {
    echo json_encode(["error" => "Data file not found."]);
    exit;
}

// Read and decode the JSON file
$data = json_decode(file_get_contents($jsonFilePath), true);

// Handle query parameters
$name = isset($_GET['name']) ? strtolower($_GET['name']) : null;
$region = isset($_GET['region']) ? strtolower($_GET['region']) : null;

// Filter the data if query parameters are provided
if ($name || $region) {
    $data = array_filter($data, function ($monster) use ($name, $region) {
        return (!$name || strpos(strtolower($monster['name']), $name) !== false) &&
               (!$region || strtolower($monster['region']) == $region);
    });
}

// Respond with the filtered or full data
echo json_encode(array_values($data));
