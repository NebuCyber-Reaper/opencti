import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Close } from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import { useFormatter } from '../../../../components/i18n';
import { SubscriptionAvatars } from '../../../../components/Subscription';
import PositionEditionOverview from './PositionEditionOverview';
import { useIsEnforceReference } from '../../../../utils/hooks/useEntitySettings';

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.background.nav,
    padding: '20px 20px 20px 60px',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    left: 5,
    color: 'inherit',
  },
  container: {
    padding: '10px 20px 20px 20px',
  },
  title: {
    float: 'left',
  },
}));

const PositionEditionContainer = (props) => {
  const classes = useStyles();
  const { t } = useFormatter();
  const { handleClose, position } = props;
  const { editContext } = position;
  return (
    <>
      <div className={classes.header}>
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={handleClose}
          size="large"
          color="primary"
        >
          <Close fontSize="small" color="primary" />
        </IconButton>
        <Typography variant="h6" classes={{ root: classes.title }}>
          {t('Update a position')}
        </Typography>
        <SubscriptionAvatars context={editContext} />
        <div className="clearfix" />
      </div>
      <div className={classes.container}>
        <PositionEditionOverview
          position={position}
          enableReferences={useIsEnforceReference('Position')}
          context={editContext}
          handleClose={handleClose}
        />
      </div>
    </>
  );
};

const PositionEditionFragment = createFragmentContainer(
  PositionEditionContainer,
  {
    position: graphql`
      fragment PositionEditionContainer_position on Position {
        id
        ...PositionEditionOverview_position
        editContext {
          name
          focusOn
        }
      }
    `,
  },
);

export default PositionEditionFragment;
