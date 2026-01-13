import { useState } from 'react'
import { Client } from 'figma-js'

export default function App() {
  const [fileKey, setFileKey] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [fileData, setFileData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFigmaFile = async () => {
    if (!fileKey || !accessToken) {
      setError('Please provide both file key and access token')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const client = Client({ personalAccessToken: accessToken })
      const response = await client.file(fileKey)
      setFileData(response.data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Figma file')
      setFileData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Figma File Access</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Figma File Key:
          </label>
          <input
            type="text"
            value={fileKey}
            onChange={(e) => setFileKey(e.target.value)}
            placeholder="Enter file key from Figma URL"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          <small style={{ color: '#666' }}>
            The file key is the long string in the Figma URL: figma.com/file/[FILE_KEY]/...
          </small>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Personal Access Token:
          </label>
          <input
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="Enter your Figma personal access token"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          <small style={{ color: '#666' }}>
            Get your token from: Account Settings → Personal Access Tokens
          </small>
        </div>

        <button
          onClick={fetchFigmaFile}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0066ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Fetch Figma File'}
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          Error: {error}
        </div>
      )}

      {fileData && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '4px' 
        }}>
          <h2>File Information</h2>
          <pre style={{ 
            overflow: 'auto', 
            maxHeight: '500px',
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '4px'
          }}>
            {JSON.stringify(fileData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}