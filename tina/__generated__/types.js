export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const PortfolioPartsFragmentDoc = gql`
    fragment PortfolioParts on Portfolio {
  __typename
  developerName
  title
  location
  avatarUrl
  heroBio
  aboutTitle
  aboutBio1
  aboutBio2
  contactEmail
  linkedInUrl
  blogUrl
  showBlogTab
  stats {
    __typename
    value
    label
  }
}
    `;
export const PillarsPartsFragmentDoc = gql`
    fragment PillarsParts on Pillars {
  __typename
  num
  title
  subtitle
  desc
}
    `;
export const ExperiencesPartsFragmentDoc = gql`
    fragment ExperiencesParts on Experiences {
  __typename
  company
  role
  location
  period
  isLatest
  bullets
  skills
}
    `;
export const SkillsPartsFragmentDoc = gql`
    fragment SkillsParts on Skills {
  __typename
  title
  items
}
    `;
export const RecommendationsPartsFragmentDoc = gql`
    fragment RecommendationsParts on Recommendations {
  __typename
  quote
  author
  role
  company
  avatarUrl
  linkedInUrl
}
    `;
export const CertificationsPartsFragmentDoc = gql`
    fragment CertificationsParts on Certifications {
  __typename
  certifications {
    __typename
    id
    title
    category
    topic
    issuer
    issueDate
    credentialId
    description
    skills
    driveUrl
    verificationUrl
  }
}
    `;
export const PortfolioDocument = gql`
    query portfolio($relativePath: String!) {
  portfolio(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PortfolioParts
  }
}
    ${PortfolioPartsFragmentDoc}`;
export const PortfolioConnectionDocument = gql`
    query portfolioConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PortfolioFilter) {
  portfolioConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PortfolioParts
      }
    }
  }
}
    ${PortfolioPartsFragmentDoc}`;
export const PillarsDocument = gql`
    query pillars($relativePath: String!) {
  pillars(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PillarsParts
  }
}
    ${PillarsPartsFragmentDoc}`;
export const PillarsConnectionDocument = gql`
    query pillarsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PillarsFilter) {
  pillarsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PillarsParts
      }
    }
  }
}
    ${PillarsPartsFragmentDoc}`;
export const ExperiencesDocument = gql`
    query experiences($relativePath: String!) {
  experiences(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ExperiencesParts
  }
}
    ${ExperiencesPartsFragmentDoc}`;
export const ExperiencesConnectionDocument = gql`
    query experiencesConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ExperiencesFilter) {
  experiencesConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ExperiencesParts
      }
    }
  }
}
    ${ExperiencesPartsFragmentDoc}`;
export const SkillsDocument = gql`
    query skills($relativePath: String!) {
  skills(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...SkillsParts
  }
}
    ${SkillsPartsFragmentDoc}`;
export const SkillsConnectionDocument = gql`
    query skillsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: SkillsFilter) {
  skillsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...SkillsParts
      }
    }
  }
}
    ${SkillsPartsFragmentDoc}`;
export const RecommendationsDocument = gql`
    query recommendations($relativePath: String!) {
  recommendations(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...RecommendationsParts
  }
}
    ${RecommendationsPartsFragmentDoc}`;
export const RecommendationsConnectionDocument = gql`
    query recommendationsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: RecommendationsFilter) {
  recommendationsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...RecommendationsParts
      }
    }
  }
}
    ${RecommendationsPartsFragmentDoc}`;
export const CertificationsDocument = gql`
    query certifications($relativePath: String!) {
  certifications(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...CertificationsParts
  }
}
    ${CertificationsPartsFragmentDoc}`;
export const CertificationsConnectionDocument = gql`
    query certificationsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: CertificationsFilter) {
  certificationsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...CertificationsParts
      }
    }
  }
}
    ${CertificationsPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    portfolio(variables, options) {
      return requester(PortfolioDocument, variables, options);
    },
    portfolioConnection(variables, options) {
      return requester(PortfolioConnectionDocument, variables, options);
    },
    pillars(variables, options) {
      return requester(PillarsDocument, variables, options);
    },
    pillarsConnection(variables, options) {
      return requester(PillarsConnectionDocument, variables, options);
    },
    experiences(variables, options) {
      return requester(ExperiencesDocument, variables, options);
    },
    experiencesConnection(variables, options) {
      return requester(ExperiencesConnectionDocument, variables, options);
    },
    skills(variables, options) {
      return requester(SkillsDocument, variables, options);
    },
    skillsConnection(variables, options) {
      return requester(SkillsConnectionDocument, variables, options);
    },
    recommendations(variables, options) {
      return requester(RecommendationsDocument, variables, options);
    },
    recommendationsConnection(variables, options) {
      return requester(RecommendationsConnectionDocument, variables, options);
    },
    certifications(variables, options) {
      return requester(CertificationsDocument, variables, options);
    },
    certificationsConnection(variables, options) {
      return requester(CertificationsConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
