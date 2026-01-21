import json

with open('visits_pending.json', 'r', encoding='utf-8') as f:
    visits = json.load(f)

with open('completeVisits_generated.ts', 'w', encoding='utf-8') as out:
    out.write('export const completeVisits: Visit[] = [\n')
    for v in visits:
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

print('Generated completeVisits_generated.ts')
