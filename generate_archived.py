import json

with open('KBUP.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

archived = data.get('archivedVisits', [])

with open('completeArchivedVisits_generated.ts', 'w', encoding='utf-8') as out:
    out.write('export const completeArchivedVisits: Visit[] = [\n')
    for v in archived:
        out.write('  {\n')
        for key, value in v.items():
            if isinstance(value, str):
                out.write(f'    {key}: "{value}",\n')
            elif value is None:
                out.write(f'    {key}: null,\n')
            else:
                out.write(f'    {key}: {json.dumps(value, ensure_ascii=False)},\n')
        out.write('  },\n')
    out.write('];\n')

print('Generated completeArchivedVisits_generated.ts')
