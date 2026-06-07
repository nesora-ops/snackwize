import os
import re

files_to_check = [
    'app/signup/page.tsx',
    'app/login/page.tsx',
    'app/dashboard/page.tsx',
    'app/admin/dashboard/page.tsx',
    'app/admin/login/page.tsx',
    'app/menu/page.tsx'
]

for file in files_to_check:
    filepath = os.path.join(os.getcwd(), file)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # Replace nav("...") with nav.push("...")
        content = re.sub(r'nav\(\s*(["\'][^"\']+["\'])\s*\)', r'nav.push(\1)', content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed nav.push in {file}")
