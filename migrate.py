import os
import re

directories = ['app', 'components']

for d in directories:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                original_content = content

                # 1. Imports
                content = content.replace("import { Link } from '@tanstack/react-router'", "import Link from 'next/link'")
                content = content.replace("import { Link, useNavigate } from '@tanstack/react-router'", "import Link from 'next/link'\nimport { useRouter } from 'next/navigation'")
                content = content.replace("import { useNavigate } from '@tanstack/react-router'", "import { useRouter } from 'next/navigation'")
                content = content.replace("import { useSearch } from '@tanstack/react-router'", "import { useSearchParams } from 'next/navigation'")
                # Add more if combined, like: import { Link, useSearch } from '@tanstack/react-router'
                content = re.sub(r"import\s*\{\s*([^}]+)\s*\}\s*from\s*'@tanstack/react-router'", 
                                 lambda m: m.group(0).replace('@tanstack/react-router', 'next/navigation').replace('useNavigate', 'useRouter').replace('useSearch', 'useSearchParams'), 
                                 content)
                # Ensure Link is imported correctly if it was combined
                if 'Link' in content and 'import Link from' not in content and 'next/navigation' in content:
                     content = content.replace("Link,", "").replace(", Link", "")
                     content = "import Link from 'next/link'\n" + content

                # 2. Link props: <Link to="/menu"> -> <Link href="/menu">
                content = re.sub(r'<Link\s+to=', '<Link href=', content)

                # 3. useNavigate() -> useRouter()
                content = content.replace('useNavigate()', 'useRouter()')
                content = content.replace('const navigate = useRouter()', 'const router = useRouter()')
                content = content.replace('navigate(', 'router.push(')
                
                # router.push({ to: '/menu' }) -> router.push('/menu')
                content = re.sub(r"router\.push\(\s*\{\s*to:\s*(['\"`][^'\"`]+['\"`])\s*\}\s*\)", r"router.push(\1)", content)

                # 4. useSearch() -> useSearchParams()
                content = content.replace('useSearch({', 'useSearchParams({') # just in case
                content = content.replace('useSearch()', 'useSearchParams()')

                # 5. Image tags
                if '<img ' in content:
                    content = content.replace('<img ', '<Image width={800} height={600} ')
                    if 'import Image from' not in content:
                        content = "import Image from 'next/image'\n" + content

                # Write if changed
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {filepath}")
