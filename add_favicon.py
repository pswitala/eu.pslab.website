import os
import glob
import re

base_dir = r"c:\git\eu.pslab\website"
search_pattern = base_dir.replace("\\", "/") + "/**/*.html"

html_files = glob.glob(search_pattern, recursive=True)
count = 0

for filepath in html_files:
    rel_path = os.path.relpath(filepath, base_dir)
    # Get standard depth correctly
    depth = rel_path.replace("\\", "/").count("/")
    
    if depth == 0:
        favicon_href = "img/favicon.ico"
    else:
        favicon_href = "../" * depth + "img/favicon.ico"
        
    favicon_tag = f'  <link rel="icon" type="image/x-icon" href="{favicon_href}">\n'
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    if '<link rel="icon"' in content or 'favicon.ico' in content:
        continue
        
    new_content = content.replace("</head>", f"{favicon_tag}</head>")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    count += 1

print(f"Dodano favicon do {count} z {len(html_files)} zbadanych html.")
