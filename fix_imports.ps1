Get-ChildItem -Path src -Recurse -Include *.test.* | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    # Remove lines that start with import { and contain describe, it, expect from vitest
    $content = $content -replace '(?m)^import \{[^}]*describe[^}]*\} from ''vitest'';\s*\r?\n', ''
    $content = $content -replace '(?m)^import \{[^}]*it[^}]*\} from ''vitest'';\s*\r?\n', ''
    $content = $content -replace '(?m)^import \{[^}]*expect[^}]*\} from ''vitest'';\s*\r?\n', ''
    # More general pattern
    $content = $content -replace '(?m)^import \{[^}]*\} from ''vitest'';\s*\r?\n', ''
    Set-Content $_.FullName $content
}