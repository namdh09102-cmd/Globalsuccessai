$folderPath = "D:\tài liệu tiếng anh\lớp 3\BÀI TẬP THEO UNIT GLOBAL 3"
$word = New-Object -ComObject Word.Application
$word.Visible = $false

$files = Get-ChildItem -Path $folderPath -Filter "*.doc"
foreach ($file in $files) {
    if ($file.Extension -eq ".doc") {
        Write-Host "Converting: $($file.Name)"
        $doc = $word.Documents.Open($file.FullName)
        $docxPath = [System.IO.Path]::ChangeExtension($file.FullName, ".docx")
        $doc.SaveAs([ref] $docxPath, [ref] 16) # 16 is the format for docx
        $doc.Close()
    }
}

$word.Quit()
Write-Host "Conversion completed!"
