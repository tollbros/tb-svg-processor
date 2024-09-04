
import { GeistProvider, CssBaseline, Page } from '@geist-ui/core'

function MyApp({ Component, pageProps }) {
  return (
    <GeistProvider>
      <CssBaseline />
      <Page style={{width: '100%'}}>
        <Page.Body style={{padding: '20px'}} >
            <Component {...pageProps} />
        </Page.Body>
      </Page>
    </GeistProvider>
  )
}
export default MyApp
