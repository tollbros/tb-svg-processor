
import { GeistProvider, CssBaseline, Page } from '@geist-ui/core'

function MyApp({ Component, pageProps }) {
  return (
    <GeistProvider>
      <CssBaseline />
	  <Page>
      	<Component {...pageProps} />
	  </Page>
    </GeistProvider>
  )
}
export default MyApp
