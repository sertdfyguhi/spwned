# run this on first launch
# needs requests
# bad code
import tarfile
import requests
import shutil
import os

req = requests.get('https://api.github.com/repos/Spu7nix/SPWN-language/releases')

if not os.path.exists('spwn'): os.mkdir('spwn')
os.chdir('spwn')

for release in req.json():
    with open(f'{release["tag_name"]}.tar.gz', 'wb') as f:
        tarball = requests.get(release['tarball_url']).content
        f.write(tarball)
    
    with tarfile.open(f'{release["tag_name"]}.tar.gz') as tar:
        tar.extractall(f'{release["tag_name"]}')

    os.chdir(f'{release["tag_name"]}')
    os.chdir(os.listdir()[0])

    if os.path.exists('spwn-lang'):
        os.chdir('spwn-lang')

    os.system('cargo build --release')
    shutil.move(
        'target/release/spwn' if os.path.exists('target/release/spwn') else 'target/release/spwn-lang',
        f'../{"../" if os.getcwd().endswith("spwn-lang") else ""}{release["tag_name"]}'
    )
    shutil.move('libraries', f'../{".." if os.getcwd().endswith("spwn-lang") else ""}')
    os.chdir('../..')
    if not os.getcwd().endswith("spwn"):
        os.chdir('..')
    os.remove(f'{release["tag_name"]}.tar.gz')
    shutil.rmtree(
        f'{release["tag_name"]}/{[d for d in os.listdir(release["tag_name"]) if d.startswith("Spu7Nix")][0]}'
    )
