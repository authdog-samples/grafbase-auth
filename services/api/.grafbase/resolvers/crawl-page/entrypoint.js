import resolver from '/home/david/dev/authdog/snapql/services/api/grafbase/resolvers/crawl-page.ts'

function arrayBufferToBase64(buffer) {
  let binaryString = ''
  const byteArray = new Uint8Array(buffer)
  for (var i = 0; i < byteArray.byteLength; i++) {
    binaryString += String.fromCharCode(byteArray[i])
  }
  return btoa(binaryString)
}

function stubConsole(logEntries) {
  for (const level of ['debug', 'error', 'info', 'warn']) {
    const oldFunction = globalThis.console[level]
    globalThis.console[level] = function (...message) {
      oldFunction(...message)
      logEntries.push({ level, message: Array.from(message).join(' ') })
    }
  }
  globalThis.console.log = globalThis.console.info
}

export default {
  async fetch(request, env, ctx) {
    const logEntries = []
    stubConsole(logEntries)

    const url = new URL(request.url)
    let jsonResponse
    if (request.method == 'GET' && url.pathname == '/health') {
      jsonResponse = { ready: true }
    } else if (request.method == 'POST' && url.pathname.endsWith('/invoke')) {
      // `endsWith()` rather than `==` to support running in a multi-worker Miniflare instance.

      const { parent, args, context, info } = await request.json()
      let returnValue = null
      try {
        returnValue = resolver(parent, args, context, info)
        if (returnValue instanceof Promise) {
          returnValue = await returnValue
        }
        if (returnValue instanceof Response) {
          const contentType = (returnValue.headers.get('content-type') || '').split(';')[0].trim()
          switch (contentType) {
            case 'application/json':
              returnValue = await returnValue.json()
              break
            case 'text/plain':
            case 'text/html':
              returnValue = await returnValue.text()
              break
            default:
              returnValue = arrayBufferToBase64(await returnValue.arrayBuffer())
              break
          }
        }
        returnValue = {
          Success: returnValue,
        }
      } catch (error) {
        if (error) {
          if (error.name == 'GraphQLError') {
            returnValue = {
              GraphQLError: {
                message: error.message,
                extensions: error.extensions,
              },
            }
          } else {
            console.error(`Exception: ${error}`)
            returnValue = {
              Error: error.toString(),
            }
          }
        } else {
          console.error(`Exception: null`)
          returnValue = {
            Error: 'null thrown',
          }
        }
      }
      jsonResponse = { value: returnValue, logEntries: logEntries }
    } else {
      throw new Error('unknown path ' + url.pathname)
    }

    return new Response(JSON.stringify(jsonResponse), {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
}
