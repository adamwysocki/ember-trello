import DS from 'ember-data';

const { Model, attr } = DS;

export default Model.extend({
  closed: attr('boolean'),
  dateLastActivity: attr('date'),
  dateLastView: attr('date'),
  desc: attr('string'),
  descData: attr('string'),
  idOrganization: attr('string'),
  idTags: attr('string'),
  invitations: attr('string'),
  invited: attr('boolean'),
  labelNames: attr(),
  name: attr('string'),
  pinned: attr('boolean'),
  powerUps: attr('string'),
  prefs: attr(),
  shortLink: attr('string'),
  shortUrl: attr('string'),
  starred: attr('boolean'),
  subscribed: attr('boolean'),
  url: attr('string'),
});
