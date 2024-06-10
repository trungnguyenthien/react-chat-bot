
const config = {
  endpoint: "http://localhost:3001"
};

function api(path) {
  const trimmedEndpoint = config.endpoint.replace(/\/+$/, ''); // Loại bỏ dấu gạch chéo cuối nếu có
  const trimmedPath = path.replace(/^\/+/, ''); // Loại bỏ dấu gạch chéo đầu nếu có
  return `${trimmedEndpoint}/${trimmedPath}`;
}

async function postQuestionAsync(question) {
  const response = await fetch(api('/ai/completion'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: question }),
  });
  return await response
}