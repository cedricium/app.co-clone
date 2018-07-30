import React from 'react'
import PropTypes from 'prop-types'
import { Truncate } from 'rebass'
import { Flex } from 'grid-styled'
import sortBy from 'lodash/sortBy'

import { connect } from 'react-redux'

import {
  selectApps,
  selectAppCategoriesArray,
  selectBlockchainCategories,
  selectStorageCategories,
  selectAuthenticationCategories,
  selectFilteredApps,
  selectPlatformFilter,
  selectCategoryFilter,
  selectPlatformName, 
  selectCategoryName
} from '@stores/apps/selectors'
import { doSelectApp } from '@stores/apps'

import { Type } from '@components/typography'
import { StyledList } from '@components/list/styled'
import { AppIcon } from '@components/app-icon'
import { Box } from '@components/box'
import { ListContainer } from '@components/list/index'
import { Tag } from '@components/tag'

import { slugify } from '@common'

// import AppStore from '@stores/apps'
// import { selectApps, selectPlatformFilter, selectFilteredApps, selectCategoryFilter } from '@stores/apps/selectors'

const getTwitterMentions = (app) => {
  const [ranking] = app.Rankings
  if (ranking) {
    return ranking.twitterMentions || 0
  }
  return 0
}

const mapStateToProps = (state) => ({
  apps: selectApps(state),
  category: selectAppCategoriesArray(state),
  blockchain: selectBlockchainCategories(state),
  storage: selectStorageCategories(state),
  authentication: selectAuthenticationCategories(state),
  platformFilter: selectPlatformFilter(state),
  filteredApps: selectFilteredApps(state),
  categoryFilter: selectCategoryFilter(state),
  platformName: selectPlatformName(state),
  categoryName: selectCategoryName(state)
})

const returnCorrectKey = (filter) => {
  switch (filter) {
    case 'storage':
      return 'storageNetwork'
    default:
      return filter
  }
}

const TableItem = (props) => <Box width={[0, 0.5 / 4]} style={{ textAlign: 'left', overflow: 'hidden' }} {...props} />

const appTag = (tag) => (
  tag ? <Tag>{tag.toLowerCase()}</Tag> : 'N/A'
)

const AppItem = connect()(
  ({ imageUrl, blockchain, name, authentication, description, storageNetwork, dispatch, single, rank, ...rest }) => {
    const AppTags = () => (
      <Type.span style={{ fontSize: '11px' }}>
        <Tag>{authentication}</Tag>
        <Tag>{storageNetwork}</Tag>
      </Type.span>
    )
    const handleClick = (id) => {
      dispatch(doSelectApp(id))
      if (typeof window !== 'undefined') {
        window.history.pushState({}, name, `/app/${rest.Slugs[0].value}`)
      }
    }
    return (
      <StyledList.Item {...rest} link onClick={() => handleClick(rest.id)} key={rest.id}>
        <Flex width={1} alignItems="center">
          <Flex width={single ? [1, 0.5] : [1]}>
            {single ? (
              <Flex pr={3} alignItems="center" justifyContent="center" style={{ opacity: 0.45 }}>
                <Type.p>{rank}</Type.p>
              </Flex>
            ) : null}
            <AppIcon src={imageUrl} alt={name} size={48} />
            <Box style={{ flexGrow: 1, maxWidth: '85%' }} px={3}>
              <Type.h4 fontSize={16} mt='4px'>{name}</Type.h4>
              <Type.p p={0} my={2} fontSize={12}>
                <Truncate>{description}</Truncate>
              </Type.p>
            </Box>
          </Flex>
          {single ? (
            <>
              <TableItem>{appTag(authentication)}</TableItem>
              <TableItem>{appTag(storageNetwork)}</TableItem>
              <TableItem>{appTag(blockchain)}</TableItem>
              <TableItem style={{textAlign: 'right', fontSize: '13px', fontWeight: 700}}>{getTwitterMentions(rest)}</TableItem>
            </>
          ) : null}
        </Flex>
      </StyledList.Item>
    )
  }
)

AppItem.propTypes = {
  imageUrl: PropTypes.string,
  blockchain: PropTypes.string,
  name: PropTypes.string,
  authentication: PropTypes.string,
  description: PropTypes.string,
  storageNetwork: PropTypes.string
}

class AppListComponent extends React.Component {
  constructor(props) {
    super(props)
    this.updateApps(props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateApps(nextProps)
  }

  updateApps(props) {
    const hasFilter = props.platformFilter || props.categoryFilter
    const apps = hasFilter ? props.filteredApps : props.apps
    const sortedApps = sortBy(apps, (app) => -getTwitterMentions(app))
    this.state = {
      sortedApps
    }
  }

  render() {
    const { filterBy = 'category', single, limit, apps, ...rest } = this.props
    const { sortedApps }= this.state
    // console.log(single)
    const items = single ? sortedApps : sortedApps
    // console.log(items.length)
    return (
      <ListContainer
        // key={i}
        header={{ title: this.props.platformName || this.props.categoryName, action: { label: 'View All' }, white: true }}
        items={single ? sortedApps : sortedApps}
        item={AppItem}
        width={[1, 1 / 2, 1 / 3]}
        limit={limit}
        single={single}
        {...rest}
      />
    )

    // return (
    //   items &&
    //   items.map((filter, i) => {
    //     const filteredList = apps.filter((app) => app[returnCorrectKey(filterBy)] === filter)
    //     // const sortedApps = sortBy(filteredList, (app) => -getTwitterMentions(app))
    //     return filteredList.length > 0 ? (
    //       <ListContainer
    //         key={i}
    //         header={{ title: filter, action: { label: 'View All' }, white: true }}
    //         items={single ? sortedApps : filteredList}
    //         item={AppItem}
    //         width={[1, 1 / 2, 1 / 3]}
    //         limit={limit}
    //         single={single}
    //         {...rest}
    //       />
    //     ) : null
    //   })
    // )
  }
}

// const AppsList = connect(mapStateToProps)(({ filterBy = 'category', single, limit, apps, ...rest }) => {
  
// })

const AppsList = connect(mapStateToProps)(AppListComponent)

AppsList.propTypes = {
  filterBy: PropTypes.string,
  single: PropTypes.string,
  limit: PropTypes.number,
  apps: PropTypes.array.isRequired
}

export { AppsList, AppItem }