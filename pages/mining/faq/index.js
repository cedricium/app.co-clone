import * as React from 'react'
import { MiningPage } from '@components/mining/page'
import { Header, Footer } from '@pages/mining/shared'
import Head from '@containers/head'
import { Flex, Type, Box } from 'blockstack-ui'
import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon'
import Link from 'next/link'
import { FAQwrapper } from './faq-section'
import Markdown from './faq-content.md'

const Content = (props) => <Flex flexDirection="column" width={1} maxWidth="780px" {...props} />

class AppMiningPrivacyPolicy extends React.PureComponent {
  render() {
    return (
      <MiningPage>
        <Head
          title="FAQ - App Mining"
          description="Earn BTC for apps you build with Blockstack. We are funding decentralized app teams simply for being pioneers in the space."
        />
        <Header />
        <Box maxWidth="780px" width={1} mx="auto" px={4}>
          <Content>
            <Link href="/mining">
              <Flex is="a" href="/mining" alignItems="center">
                <ArrowLeftIcon />
                <Type>Back to App Mining</Type>
              </Flex>
            </Link>
          </Content>

          <Content color="white">
            <FAQwrapper>
              <Type is="h1" mt={5} fontWeight={300}>
                App Mining Frequently Asked Questions
              </Type>
              <Markdown />
            </FAQwrapper>
          </Content>
          <Footer />
        </Box>
      </MiningPage>
    )
  }
}

export default AppMiningPrivacyPolicy
