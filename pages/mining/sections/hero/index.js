import React from 'react'
import { Flex, Box, Type } from 'blockstack-ui'
import { CurrencyUsdIcon } from 'mdi-react'
import { Title, Wrapper, Section, Logo, AppItem, LearnMore, CallToAction } from '@components/mining/shared'
import { State } from 'react-powerplug'

function arrayRotateOne(arr, reverse) {
  if (reverse) arr.unshift(arr.pop())
  else arr.push(arr.shift())
  return arr
}

const Apps = ({ apps, ...rest }) => {
  const limit = 2
  let items = [apps[0], apps[1], apps[2]]

  return (
    <State initial={{ active: 1, items }}>
      {({ state, setState }) => {
        const handleClick = () => {
          setState((s) => {
            if (s.active > limit) {
              return {
                active: 1
              }
            } else {
              return {
                active: s.active + 1
              }
            }
          })
        }
        const timeout = setTimeout(handleClick, 3000)

        return (
          <Box position="relative" width={1} {...rest}>
            {state.items.map(
              (item, i) =>
                i <= limit ? (
                  <AppItem app={item} active={state.active} key={1 + i} index={i + 1} length={limit + 1} />
                ) : null
            )}
          </Box>
        )
      }}
    </State>
  )
}

const SubtitleBTC = ({ ...rest }) => (
  <Flex alignItems={'center'} color={'blue.accent'} {...rest}>
    <Flex
      alignItems={'center'}
      justifyContent={'center'}
      size={48}
      borderColor="blue.accent"
      border={1}
      borderRadius={80}
    >
      <CurrencyUsdIcon />
    </Flex>
    <Type fontFamily={'brand'} pl={4} lineHeight={1.55}>
      The better your app,
      <br />
      the more you earn.
    </Type>
  </Flex>
)

const Hero = ({ apps, ...rest }) => (
  <Section pb={[9, 8, '12vh']} overflow="hidden" bg="blue.dark" {...rest}>
    <Wrapper>
      <Flex width={[1, 1, 0.5, 0.6]} flexShrink={1} flexDirection="column">
        <Logo pb={7} />
        <Title fontSize={[7, 7, 7, 8]}>Every 30 days we&nbsp;payout $100k to the best apps.</Title>
        <SubtitleBTC pt={7} />
      </Flex>
      <Flex
        pl={[0, 0, 8, 0]}
        alignItems="center"
        justifyContent="center"
        pt={[7, 7, 0, 0]}
        flexGrow={1}
        flexDirection="column"
        position="relative"
      >
        <CallToAction width={1} />
        <Apps apps={apps} mt={7} />
        <LearnMore
          display={['none', 'none', 'flex']}
          position={['absolute']}
          pt={8}
          pb={8}
          bottom={['-180px', '-180px']}
          is="a"
          href="#learn-more"
        />
      </Flex>
    </Wrapper>
  </Section>
)

export { Hero }
