# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['C:\\Users\\ongxu\\OneDrive\\Documents\\Coding\\Website\\keywordgenerator\\pythonUtil\\main.py'],
    pathex=[],
    binaries=[('C:\\Users\\ongxu\\OneDrive\\Documents\\Coding\\Website\\keywordgenerator\\pythonUtil\\.env\\Lib\\site-packages\\pyexiv2\\lib\\exiv2.dll', '.'), ('C:\\Users\\ongxu\\OneDrive\\Documents\\Coding\\Website\\keywordgenerator\\pythonUtil\\.env\\Lib\\site-packages\\pyexiv2\\lib\\py3.9-win\\exiv2api.pyd', '.')],
    datas=[],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='main',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
