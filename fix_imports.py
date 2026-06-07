import os

files_to_check = [
    'app/signup/page.tsx',
    'app/login/page.tsx',
    'app/dashboard/page.tsx',
    'app/admin/login/page.tsx'
]

for file in files_to_check:
    filepath = os.path.join(os.getcwd(), file)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        if 'useRouter' in content and 'import { useRouter } from "next/navigation";' not in content:
            content = content.replace("'use client'\n", "'use client'\n\nimport { useRouter } from \"next/navigation\";\n")
            
        if '<Link' in content and 'import Link from "next/link";' not in content:
            content = content.replace("'use client'\n", "'use client'\n\nimport Link from \"next/link\";\n")
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed imports in {file}")
