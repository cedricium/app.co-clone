import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import NotificationSystem from 'react-notification-system'
import Papa from 'papaparse'
import Router from 'next/router'

import { monthName } from '@utils'
import MiningActions from '@stores/mining-admin/actions'
import StyledMonth from '@components/mining-admin/month'
import { FormTd, Table } from '@components/mining-admin/table'
import { Input, Button, Textarea } from '@components/mining-admin/collapsable'

let AdminLayout = () => ''

class UploadReport extends React.Component {
  state = {
    reviewerName: '',
    summary: '',
    errors: []
  }

  static getInitialProps({ req }) {
    const { id } = req.params
    return {
      id
    }
  }

  constructor(props) {
    super(props)
    this.csv = React.createRef()
    this.notifications = React.createRef()
  }

  componentDidMount() {
    AdminLayout = require('../../../containers/admin/layout').default // eslint-disable-line global-require
    console.log(this.props)
    this.props.fetchMiningMonths()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.saved) {
      Router.push(`/admin/mining/months/${this.props.id}`)
    }
    if (nextProps.uploadError && !this.props.uploadError) {
      const { errors } = this.state
      errors.push(nextProps.uploadError)
      this.setState({ errors })
    }
  }

  save() {
    const csv = this.csv.current.files[0]
    Papa.parse(csv, { 
      header: true,
      complete: ({ data, meta }) => {
        // console.log(rest)
        const errors = []
        if (meta.fields.indexOf('App Id') === -1) {
          errors.push('Spreadsheet does not contain a required "App Id" column')
        }
        if (meta.fields.indexOf('Ranking') === -1) {
          errors.push('Spreadsheet does not contain required column "Ranking"')
        }
        const rankings = {}
        let nonUniqueRankings = false
        let nanRankings = false
        const apps = data.map((app) => {
          const appId = app['App Id']
          if (rankings[appId]) nonUniqueRankings = true
          rankings[appId] = true
          const ranking = parseInt(app.Ranking, 10)
          if (isNaN(ranking)) nanRankings = true
          return {
            ...app,
            appId
          }
        })
        if (nonUniqueRankings || nanRankings) {
          errors.push('Spreadsheet contains at least one value in the "Ranking" that is non-unique or non-numeric')
        }
        if (errors.length > 0) {
          return this.setState({ errors })
        }
        this.setState({ errors: [] })
        const { reviewerName, summary } = this.state
        const report = {
          reviewerName,
          summary,
          apps,
          monthId: this.props.id
        }
        this.props.saveReport(report)
        console.log(report)
      }
    })
  }

  errors() {
    return this.state.errors.map((error) => (
      <li key={error}>{error}</li>
    ))
  }

  form() {
    // console.log(Section)
    const { errors } = this.state
    return (
      <StyledMonth.Section>
        <h2>Add reviewer report for {monthName(this.props.month)}</h2>
        {errors.length > 0 && (
          <StyledMonth.Content errors>
            <p>The following errors were encountered when trying to submit:</p>
            <ul>
              {this.errors()}
            </ul>
          </StyledMonth.Content>
        )}
        <div style={{ paddingBottom: '1em' }}>
          <Table>
            <tbody>
              <tr>
                <FormTd>
                  Reviewer Name
                </FormTd>
                <FormTd>
                  <Input type="text"
                    value={this.state.reviewerName}
                    onChange={(evt) => this.setState({reviewerName: evt.target.value })}
                  />
                </FormTd>
              </tr>
              <tr>
                <FormTd>
                  Spreadsheet
                </FormTd>
                <FormTd>
                  <Input type="file" innerRef={this.csv}/>
                </FormTd>
              </tr>
              <tr>
                <FormTd>
                  Summary
                </FormTd>
                <FormTd>
                  <Textarea 
                    value={this.state.summary}
                    onChange={(evt) => this.setState({ summary: evt.target.value })}
                  />
                </FormTd>
              </tr>
            </tbody>
          </Table>
          <Button onClick={() => this.save()}>Submit</Button>
        </div>
      </StyledMonth.Section>
    )
  }

  render() {
    return (
      <>
        <NotificationSystem
          ref={this.notifications}
        />
        {AdminLayout && (
          <AdminLayout>
            {this.props.month && this.form()}
            <br />
            <br />
          </AdminLayout>
        )}
      </>
    )
  }
}

const mapStateToProps = (state, props) => ({
  month: state.miningAdmin.months.find((month) => month.id === parseInt(props.id, 10)),
  saved: state.miningAdmin.reportSaved,
  uploadError: state.miningAdmin.uploadReportError
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, MiningActions), dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadReport)