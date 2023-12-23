// src/FileEmbeddingCount.tsx
import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

const FILE_EMBEDDING_COUNT_QUERY = gql`
  {
    Aggregate {
      FileEmbedding {
        meta {
          count
        }
      }
    }
  }
`;

const FileEmbeddingCount: React.FC = () => {
  const { data, loading, error } = useQuery(FILE_EMBEDDING_COUNT_QUERY, {
    pollInterval: 5000, // Poll every 5000 milliseconds (5 seconds)
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Assuming the response always has at least one FileEmbedding item
  const count = data?.Aggregate?.FileEmbedding[0]?.meta?.count;

  return (
    <div>
      <h2>File Embedding Count</h2>
      <p>Count: {count}</p>
    </div>
  );
};

export default FileEmbeddingCount;
