import os
import re

# 1. Clean SiteLayout from all page.tsx files
# 2. Fix TanStack imports and Route definitions completely
# 3. Ensure default exports

pages_dir = 'app'

for root, dirs, files in os.walk(pages_dir):
    for file in files:
        if file.endswith('page.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Fix imports
            content = re.sub(r'import \{[^}]*createFileRoute[^}]*\} from ["\']@tanstack/react-router["\'];?\n?', '', content)
            content = re.sub(r'import \{[^}]*useNavigate[^}]*\} from ["\']@tanstack/react-router["\'];?\n?', 'import { useRouter } from "next/navigation";\n', content)
            content = re.sub(r'import \{[^}]*Link[^}]*\} from ["\']@tanstack/react-router["\'];?\n?', 'import Link from "next/link";\n', content)
            
            # Remove any remaining @tanstack/react-router imports entirely
            content = re.sub(r'import .* from ["\']@tanstack/react-router["\'];?\n?', '', content)

            # Fix Route wrapper
            # Find: export const Route = createFileRoute(...)({ ... component: ComponentName, ... });
            route_match = re.search(r'export const Route = createFileRoute[^;]+;', content, flags=re.DOTALL)
            if route_match:
                # extract component
                comp_match = re.search(r'component:\s*(?:[()A-Za-z0-9_=>\s<>/]*<([A-Za-z0-9_]+)\s*/>|[A-Za-z0-9_]+)', route_match.group(0))
                # remove the block
                content = content.replace(route_match.group(0), '')
                
            # Make sure there is an export default
            if 'export default ' not in content:
                # Find the main component, usually function Index, MenuPage, etc.
                func_match = re.search(r'function ([A-Z][a-zA-Z0-9_]*)', content)
                if func_match:
                    comp_name = func_match.group(1)
                    content = content.replace(f'function {comp_name}', f'export default function {comp_name}')

            # Remove SiteLayout
            content = re.sub(r'import \{ SiteLayout \} from "@/components/layout/SiteLayout";\n?', '', content)
            content = re.sub(r'<SiteLayout[^>]*>', '<>', content)
            content = re.sub(r'</SiteLayout>', '</>', content)

            # Fix nav({ to: "/" }) to router.push("/")
            content = content.replace('nav({ to: "/" })', 'nav("/")')
            content = content.replace('nav({ to: "/menu" })', 'nav("/menu")')
            content = content.replace('nav({ to: "/admin/dashboard" })', 'nav("/admin/dashboard")')
            content = content.replace('nav({ to: "/admin/login" })', 'nav("/admin/login")')

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Cleaned {filepath}")

# 4. Delete leftover files in src/
leftovers = [
    'src/router.tsx',
    'src/server.ts',
    'src/start.ts',
    'components/layout/SiteLayout.tsx',
    'components/sections/RouteGuard.tsx',
    'lib/api/example.functions.ts'
]
for p in leftovers:
    if os.path.exists(p):
        os.remove(p)
        print(f"Deleted {p}")

# 5. Fix Logo.tsx path
logo_path = 'components/layout/Logo.tsx'
if os.path.exists(logo_path):
    with open(logo_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('@/assets/snackwize-logo.png.asset.json', '@/src/assets/snackwize-logo.png.asset.json')
    with open(logo_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed Logo.tsx")
