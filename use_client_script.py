import os

directories = ['app', 'components', 'context', 'hooks']
client_keywords = [
    'useState', 'useEffect', 'useContext', 'useRouter', 'useSearchParams',
    'localStorage', 'onClick', 'onChange', 'framer-motion', 'useCart', 'useToast', 'createContext'
]

for d in directories:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                
                # Exclude layout.tsx from automatic use client unless necessary, but layout.tsx shouldn't need it.
                if filepath == os.path.join('app', 'layout.tsx'):
                    continue

                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                if "'use client'" in content or '"use client"' in content:
                    continue

                needs_client = any(keyword in content for keyword in client_keywords)
                
                if needs_client:
                    content = "'use client'\n\n" + content
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Added 'use client' to {filepath}")
