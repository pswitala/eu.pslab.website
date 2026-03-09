import os
import re

# Dla plików w głównym katalogu
nav_root = """<nav class="footer__nav" aria-label="Mapa strony">
          <a href="#uslugi">Usługi</a>
          <a href="#cloud-computing">Cloud Computing</a>
          <a href="#machine-learning-ai">AI / ML</a>
          <a href="#obsluga-informatyczna">Obsługa IT</a>
          <a href="#business-intelligence">Business Intelligence</a>
          <a href="#nadzor-wdrozenia">Nadzór IT</a>
          <a href="baza-wiedzy/">Baza wiedzy</a>
          <a href="case-study/">Case Studies</a>
          <a href="#zespol">Zespół</a>
          <a href="#faq">FAQ</a>
          <a href="#kontakt">Kontakt</a>
        </nav>"""

# Dla plików w podkatalogach pierwszego poziomu (np. /uslugi/, /baza-wiedzy/)
nav_sub = """<nav class="footer__nav" aria-label="Mapa strony">
          <a href="../#uslugi">Usługi</a>
          <a href="../#cloud-computing">Cloud Computing</a>
          <a href="../#machine-learning-ai">AI / ML</a>
          <a href="../#obsluga-informatyczna">Obsługa IT</a>
          <a href="../#business-intelligence">Business Intelligence</a>
          <a href="../#nadzor-wdrozenia">Nadzór IT</a>
          <a href="../baza-wiedzy/">Baza wiedzy</a>
          <a href="../case-study/">Case Studies</a>
          <a href="../#zespol">Zespół</a>
          <a href="../#faq">FAQ</a>
          <a href="../#kontakt">Kontakt</a>
        </nav>"""

directory = r"c:\git\eu.pslab\website"
count = 0

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(".html"):
            filepath = os.path.join(root, file)
            # Określanie poziomu zagłębienia
            rel_path = os.path.relpath(filepath, directory)
            depth = len(rel_path.split(os.sep)) - 1
            
            nav_replacement = nav_root if depth == 0 else nav_sub
            
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
            except UnicodeDecodeError:
                try:
                    with open(filepath, "r", encoding="windows-1250") as f:
                        content = f.read()
                except Exception as e:
                    print(f"Skipping {filepath} due to encoding error: {e}")
                    continue
            
            # Wyszukaj całą sekcję <nav class="footer__nav"...>...</nav>
            # Używamy re.sub z dopasowaniem najkrótszym (.*?)
            updated_content, num_subs = re.subn(r'<nav class="footer__nav"((?!</nav>).)*?</nav>', nav_replacement, content, flags=re.DOTALL | re.IGNORECASE)
            
            # Zepewne na niektórych podstronach nav nie ma aria-label
            updated_content, num_subs2 = re.subn(r'<nav class="footer__nav">.*?</nav>', nav_replacement, updated_content, flags=re.DOTALL)

            total_subs = num_subs + num_subs2
            
            if total_subs > 0:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(updated_content)
                count += 1
                print(f"Zaktualizowano nawigację w {filepath}")

print(f"Zaktualizowano ogółem plików: {count}")
