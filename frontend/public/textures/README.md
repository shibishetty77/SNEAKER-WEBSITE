Texture pack structure for ultra‑realistic shoes

Place maps under:

- /textures/{variant}/{material}/upper_normal.{jpg|png|webp|jpeg}
- /textures/{variant}/{material}/upper_roughness.{jpg|png|webp|jpeg}
- /textures/{variant}/{material}/upper_metallic.{jpg|png|webp|jpeg}
- /textures/{variant}/{material}/upper_ao.{jpg|png|webp|jpeg}

- /textures/{variant}/{material}/sole_normal.{jpg|png|webp|jpeg}
- /textures/{variant}/{material}/sole_roughness.{jpg|png|webp|jpeg}
- /textures/{variant}/{material}/sole_metallic.{jpg|png|webp|jpeg}
- /textures/{variant}/{material}/sole_ao.{jpg|png|webp|jpeg}

Where:
- variant: classic | running | basketball | casual | hiking
- material: leather | canvas | mesh | suede | synthetic

Notes:
- Files are optional; missing maps are skipped gracefully.
- Use linear color space for normal/roughness/metallic/ao maps.
- Recommended sizes: 1024–2048px; PNG/WebP or high‑quality JPG.

