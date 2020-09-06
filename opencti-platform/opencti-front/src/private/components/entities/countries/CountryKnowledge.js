import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { compose } from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import inject18n from '../../../../components/i18n';
import EntityStixCoreRelationships from '../../common/stix_core_relationships/EntityStixCoreRelationships';
import StixDomainObjectKnowledge from '../../common/stix_domain_objects/StixDomainObjectKnowledge';
import StixCoreRelationship from '../../common/stix_core_relationships/StixCoreRelationship';
import CountryPopover from './CountryPopover';
import StixDomainObjectHeader from '../../common/stix_domain_objects/StixDomainObjectHeader';
import StixCoreObjectKnowledgeBar from '../../common/stix_core_objects/StixCoreObjectKnowledgeBar';

const styles = () => ({
  container: {
    margin: 0,
    padding: '0 200px 0 0',
  },
});

class CountryKnowledgeComponent extends Component {
  render() {
    const { classes, country } = this.props;
    const link = `/dashboard/entities/countries/${country.id}/knowledge`;
    return (
      <div className={classes.container}>
        <StixDomainObjectHeader
          stixDomainObject={country}
          PopoverComponent={<CountryPopover />}
          variant="noaliases"
        />
        <StixCoreObjectKnowledgeBar
          stixCoreObjectLink={link}
          availableSections={[
            'cities',
            'threat_actors',
            'intrusion_sets',
            'campaigns',
            'incidents',
            'malwares',
            'observables',
            'sightings',
          ]}
        />
        <Route
          exact
          path="/dashboard/entities/countries/:countryId/knowledge/relations/:relationId"
          render={(routeProps) => (
            <StixCoreRelationship
              entityId={country.id}
              paddingRight={true}
              {...routeProps}
            />
          )}
        />
        <Route
          exact
          path="/dashboard/entities/countries/:countryId/knowledge/overview"
          render={(routeProps) => (
            <StixDomainObjectKnowledge
              stixDomainObjectId={country.id}
              stixDomainObjectType="Country"
              {...routeProps}
            />
          )}
        />
        <Route
          exact
          path="/dashboard/entities/countries/:countryId/knowledge/cities"
          render={(routeProps) => (
            <EntityStixCoreRelationships
              entityId={country.id}
              relationshipType="located-at"
              targetStixDomainObjectTypes={['City']}
              entityLink={link}
              isRelationReversed={true}
              {...routeProps}
            />
          )}
        />
        <Route
          exact
          path="/dashboard/entities/countries/:countryId/knowledge/organizations"
          render={(routeProps) => (
            <EntityStixCoreRelationships
              entityId={country.id}
              relationshipType="located-at"
              targetStixDomainObjectTypes={['Organization']}
              entityLink={link}
              isRelationReversed={true}
              {...routeProps}
            />
          )}
        />
        <Route
          exact
          path="/dashboard/entities/countries/:countryId/knowledge/threats"
          render={(routeProps) => (
            <EntityStixCoreRelationships
              entityId={country.id}
              relationshipType="targets"
              targetStixDomainObjectTypes={[
                'Country',
                'Threat-Actor',
                'Intrusion-Set',
                'Campaign',
                'X-OpenCTI-Incident',
                'Malware',
              ]}
              entityLink={link}
              isRelationReversed={true}
              {...routeProps}
            />
          )}
        />
      </div>
    );
  }
}

CountryKnowledgeComponent.propTypes = {
  country: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
};

const CountryKnowledge = createFragmentContainer(CountryKnowledgeComponent, {
  country: graphql`
    fragment CountryKnowledge_country on Country {
      id
      name
      x_opencti_aliases
    }
  `,
});

export default compose(
  inject18n,
  withRouter,
  withStyles(styles),
)(CountryKnowledge);
