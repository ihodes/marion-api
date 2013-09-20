// Used to mock objects for tests

var testOrg = { name:"T", key: "test-key" };
db.organizations.insert(testOrg);

var people = [{organization: db.organizations.findOne(), params: {name: "Person Dude."}},
              {organization: db.organizations.findOne(), params: {name: "Person Dudette."}}]

var protocols = [{organization: db.organizations.findOne(), name: "Test Protocol 0", description: "This is a test organization LLC 0."},
                 {organization: db.organizations.findOne(), name: "Test Protocol 1", description: "This is a test organization LLC 1."},
                 {organization: db.organizations.findOne(), name: "Test Protocol 2", description: "This is a test organization LLC 2."},
                 {organization: db.organizations.findOne(), name: "Test Protocol 3", description: "This is a test organization LLC 3."},
                 {organization: db.organizations.findOne(), name: "Test Protocol 4", description: "This is a test organization LLC 4."}]

for(idx in people)
    db.people.insert(people[idx]);
for(idx in protocols)
    db.protocols.insert(protocols[idx]);
