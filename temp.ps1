
                $word = New-Object -ComObject Word.Application
                $word.Visible = $false
                $doc = $word.Documents.Open('D:\tài liệu tiếng anh\lớp 3\BÀI TẬP THEO UNIT GLOBAL 3\Unit 20.doc')
                $doc.SaveAs([ref] 'D:\tài liệu tiếng anh\lớp 3\BÀI TẬP THEO UNIT GLOBAL 3\Unit 20.docx', [ref] 16)
                $doc.Close()
                $word.Quit()
            