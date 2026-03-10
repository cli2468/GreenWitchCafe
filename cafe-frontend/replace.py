import os
import re

dir_path = r"c:\Users\Chris\.gemini\antigravity\scratch\Green Witch Cafe\cafe-frontend\src"

replacements = {
    r"\[#F4EFE6\]": "brand-bg",
    r"\[#3A3530\]": "brand-text",
    r"\[#1a2e20\]": "brand-primary",
    r"\[#E8F0EA\]": "brand-secondary/10"
}

for root, _, files in os.walk(dir_path):
    for fn in files:
        if fn.endswith('.jsx'):
            filepath = os.path.join(root, fn)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for pattern, rep in replacements.items():
                new_content = re.sub(pattern, rep, new_content)
                
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
