$files = Get-ChildItem -Filter *.html
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace common colored tailwind classes with indigo
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, '\b(blue|rose|purple|pink|emerald|teal|amber|fuchsia)-([0-9]{2,3}(/[0-9]{1,2})?)\b', 'indigo-$2')
    
    # Replace custom neon classes
    $content = $content -replace "neon-cyan", "indigo-400"
    $content = $content -replace "neon-magenta", "indigo-600"
    $content = $content -replace "neon-orange", "indigo-500"
    $content = $content -replace "neon-violet", "indigo-400"

    # Replace specific hex codes in index2.html
    $content = $content -replace "#F03096", "#4f46e5"
    $content = $content -replace "#AF1DFD", "#6366f1"
    $content = $content -replace "#FC45F3", "#818cf8"
    
    Set-Content -Path $file.FullName -Value $content
}
Write-Host "Colors updated."
