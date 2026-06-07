import os
import re

for root, dirs, files in os.walk('app'):
    for file in files:
        if file.endswith('page.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            
            # Remove import { createFileRoute } from "@tanstack/react-router";
            content = re.sub(r'import\s*\{\s*createFileRoute\s*\}\s*from\s*["\']@tanstack/react-router["\'];?\n?', '', content)
            
            # Remove export const Route = createFileRoute(...)({ ... component: ComponentName, ... });
            # We want to find the component name so we can export it as default
            match = re.search(r'component:\s*([A-Za-z0-9_]+),?', content)
            component_name = match.group(1) if match else None
            
            # Remove the whole Route definition
            content = re.sub(r'export\s+const\s+Route\s*=\s*createFileRoute\([^)]+\)\(\{[\s\S]*?\}\);?\n?', '', content)
            
            if component_name:
                # Add export default to the component definition if not already there
                if f'function {component_name}' in content and f'export default function {component_name}' not in content:
                    content = content.replace(f'function {component_name}', f'export default function {component_name}')
                elif f'const {component_name} = ' in content and f'export default {component_name}' not in content:
                    content += f'\nexport default {component_name};\n'
                    
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Cleaned {filepath}")
