import {
  connectorDelete,
  connectors,
  connectorsForExport,
  connectorsForImport,
  loadConnectorById,
  pingConnector,
  registerConnector,
  resetStateConnector,
} from '../domain/connector';
import {
  connectorForWork,
  createWork,
  deleteWork,
  reportActionImport,
  updateActionExpectation,
  updateProcessedTime,
  updateReceivedTime,
  worksForConnector,
} from '../domain/work';
import { findById } from '../domain/user';
import { now } from '../database/grakn';

const connectorResolvers = {
  Query: {
    connectors: () => connectors(),
    connectorsForExport: () => connectorsForExport(),
    connectorsForImport: () => connectorsForImport(),
  },
  Connector: {
    works: (connector) => worksForConnector(connector.id),
  },
  Work: {
    connector: (work) => connectorForWork(work.id),
    user: (work) => findById(work.user_id),
  },
  Mutation: {
    deleteConnector: (_, { id }, { user }) => connectorDelete(user, id),
    registerConnector: (_, { input }, { user }) => registerConnector(user, input),
    resetStateConnector: (_, { id }, { user }) => resetStateConnector(user, id),
    pingConnector: (_, { id, state }, { user }) => pingConnector(user, id, state),
    // Work part
    workAdd: async (_, { connectorId, friendlyName }, { user }) => {
      const connector = await loadConnectorById(connectorId);
      return createWork(user, connector, friendlyName, connector.id, { receivedTime: now() });
    },
    workEdit: (_, { id }, { user }) => ({
      delete: () => deleteWork(id),
      reportExpectation: ({ error }) => reportActionImport(user, id, error),
      addExpectations: ({ expectations }) => updateActionExpectation(user, id, expectations),
      toReceived: ({ message }) => updateReceivedTime(user, id, message),
      toProcessed: ({ message }) => updateProcessedTime(user, id, message),
    }),
  },
};

export default connectorResolvers;
