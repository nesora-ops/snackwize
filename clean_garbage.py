import os
import re

for root, dirs, files in os.walk('app'):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            
            # Remove the specific garbage block:
            # ,
            #   component: ...,
            # });
            content = re.sub(r',\s*component:\s*[^,]+,\s*}\);?', '', content)
            
            # Also handle if it has <AdminGuard> etc.
            content = re.sub(r',\s*component:\s*\(\)\s*=>\s*<[^>]+><[^>]+></[^>]+>,\s*}\);?', '', content)
            
            # And just a general catch-all for this pattern:
            content = re.sub(r',\s*component:\s*.*?\n\}\);?', '', content, flags=re.DOTALL)
            
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Cleaned garbage in {filepath}")
