import { access, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const defaultPrototypeRoot = resolve(projectRoot, '../dadoscreche/dadoscreche/onboarding')
const prototypeRoot = resolve(process.env.DADOSCRECHE_ONBOARDING_DIR || defaultPrototypeRoot)
const sourceRoot = resolve(prototypeRoot, 'src/data')
const outputRoot = resolve(projectRoot, 'shared/data')

const files = [
  ['criterios.json', 'criterios.generated.json'],
  ['meta.json', 'meta.generated.json'],
  ['unidades.json', 'unidades.generated.json'],
]

await access(sourceRoot)

for (const [sourceName, outputName] of files) {
  const raw = await readFile(resolve(sourceRoot, sourceName), 'utf8')
  const parsed = JSON.parse(raw)

  if (sourceName === 'unidades.json' && (!Array.isArray(parsed) || parsed.length < 800)) {
    throw new Error('O catálogo do time não contém o recorte esperado de unidades.')
  }
  if (sourceName === 'criterios.json' && (!Array.isArray(parsed) || parsed.length !== 13)) {
    throw new Error('A régua do time não contém os 13 critérios esperados.')
  }

  await writeFile(resolve(outputRoot, outputName), `${JSON.stringify(parsed, null, sourceName === 'unidades.json' ? 0 : 1)}\n`)
  console.log(`${sourceName} -> shared/data/${outputName}`)
}

console.log(`Dados sincronizados de ${prototypeRoot}`)
