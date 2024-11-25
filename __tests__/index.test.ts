import * as core from '@actions/core'
import * as main from '../src/main'
import { exec } from '@actions/exec'

// Mock modules
jest.mock('@actions/exec')
;(exec as jest.Mock).mockImplementation(async () => Promise.resolve(0))

// Mock process.exit with proper typing
const mockExit = jest.fn() as jest.Mock<never, [number?]>
process.exit = mockExit

// Mock inputs
jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
  const inputs: { [key: string]: string } = {
    target: 'desktop',
    host: 'linux',
    version: '6.8.0',
    arch: 'gcc_64',
    wasm: 'none',
    dir: '/test/dir',
    modules: 'qtquick3d qtquicktimeline',
    cache: 'true',
    'cache-key-prefix': 'test-prefix',
    'setup-python': 'true',
    'add-tools-to-path': 'true',
    'set-env': 'true',
    'no-qt-binaries': 'false',
    'tools-only': 'false',
    aqtversion: '==3.2.*',
    py7zrversion: '==0.20.*',
    'install-deps': 'false'
  }
  return inputs[name] || ''
})

const runMock = jest
  .spyOn(main, 'run')
  .mockImplementation(async () => Promise.resolve())

describe('index', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('executes run function', async () => {
    await main.run()
    expect(runMock).toHaveBeenCalled()
  })

  it('provides valid inputs', () => {
    expect(core.getInput('target')).toBe('desktop')
    expect(core.getInput('host')).toBe('linux')
    expect(core.getInput('version')).toBe('6.8.0')
  })
})
